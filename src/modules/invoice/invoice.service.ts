import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { BookingStatus } from '../bookings/entities/booking.entity';

enum PaymentStatus {
  FAILED = -1,
  PROCESSING = 0,
  COMPLETED = 1
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private apiResponse: ResponseResult,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto) {
    this.apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      // Check existed booking
      const existedBooking = await this.invoiceRepository.findOne({
        where: { booking: createInvoiceDto.bookingId }
      });
      // Check booking status
      const booking = await this.bookingRepository.findOne({
        where: {id: createInvoiceDto.bookingId}
      })
      if (existedBooking != null && Object.keys(existedBooking).length !== 0) {
        throw new HttpException("The booking has been existed in another invoice", HttpStatus.NOT_ACCEPTABLE)
      } else if (booking.status == -1) {
        throw new HttpException("The booking cancelled, none of invoice show up", HttpStatus.NOT_FOUND)
      }
      else {
        const newPayment = this.invoiceRepository.create(createInvoiceDto);
        newPayment.invoiceStatus = PaymentStatus.PROCESSING;

        // Add booking
        const getBooking = await this.bookingRepository.findOne(createInvoiceDto.bookingId);
        if (getBooking != null && Object.keys(getBooking).length !== 0) {
          newPayment.booking = getBooking;
          newPayment.amount = (getBooking.price + getBooking.tipAmount + getBooking.waitingFreeAmount) - getBooking.promotionAmount;
        } else {
          throw new HttpException("Booking is required", HttpStatus.NOT_FOUND) 
        }
        this.apiResponse.data = await this.invoiceRepository.save(newPayment);
      }
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    this.apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      const updateInvoice = this.invoiceRepository.create(updateInvoiceDto);
      const getInvoice = await this.invoiceRepository.findOne(id);

      if (getInvoice != null && Object.keys(getInvoice).length !== 0) {
        if (getInvoice.invoiceStatus == PaymentStatus.COMPLETED || getInvoice.invoiceStatus == PaymentStatus.FAILED) {
          throw new HttpException("You cannot update processed invoice", HttpStatus.EXPECTATION_FAILED) 
        } else {
          updateInvoice.invoiceStatus = PaymentStatus.PROCESSING;
          await this.invoiceRepository.update({ id: id }, updateInvoice);
          this.apiResponse.data = await this.invoiceRepository.findOne(id);
        }
      }
      else {
        throw new HttpException("Invoice not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async processPayment(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      const getPayment = await this.invoiceRepository.findOne({
        where: { id: id },
        relations: ['booking'],
      });
      if (getPayment != null && Object.keys(getPayment).length !== 0) {
        if (getPayment.invoiceStatus == PaymentStatus.COMPLETED) {
          throw new HttpException("Invoice has been processed", HttpStatus.EXPECTATION_FAILED) 
        }
        else {
          getPayment.invoiceStatus = PaymentStatus.COMPLETED;
          // TODO
          getPayment.orderNo = Math.floor(Math.random() * 1000000) + "TH";
          getPayment.paymentDate = new Date();
          getPayment.updatedAt = new Date();
          await this.invoiceRepository.update({ id: id }, getPayment);

          // Update complete booking 
          const getBooking = await this.bookingRepository.findOne(getPayment.booking.id);
          getBooking.status = BookingStatus.COMPLETED;
          await this.bookingRepository.update(getBooking.id, getBooking);

          return await this.findOne(id);
        }
      } else { 
        throw new HttpException("Invoice not found", HttpStatus.NOT_FOUND) 
      }
    }
    catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findByorderNo(orderNo: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { orderNo: orderNo },
        relations: ['booking.carInfo', 'booking.driverInfo', 'booking.paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findCurrentPayment(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { userId: userId, invoiceStatus: PaymentStatus.PROCESSING },
        relations: ['booking.carInfo', 'booking.driverInfo', 'booking.paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findByUserId(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.find({
        where: { userId: userId },
        relations: ['booking.carInfo', 'booking.driverInfo', 'booking.paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findOne(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { id: id },
        relations: ['booking.carInfo', 'booking.driverInfo', 'booking.paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }
}
