import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { PaymentMethod } from '../paymentmethod/entities/paymentmethod.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
enum PaymentStatus {
  FAILED = -1,
  PROCESSING = 0,
  COMPLETED = 1
}

enum BookingStatus {
  CANCELED = -1,
  PROCESSING = 0,
  COMPLETED = 1,
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private apiResponse: ResponseResult,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto) {
    this.apiResponse = new ResponseResult();
    try {
      const newPayment = this.invoiceRepository.create(createInvoiceDto);
      newPayment.invoiceStatus = PaymentStatus.PROCESSING;

      // Add payment method
      const getPaymentMethod = await this.paymentMethodRepository.findOne(createInvoiceDto.paymentMethodId);
      if (Object.keys(getPaymentMethod).length !== 0) {
        newPayment.paymentMethod = getPaymentMethod;
      } else {
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        this.apiResponse.errorMessage = "Payment method is required";
        return this.apiResponse;
      }

      // Add booking
      const getBooking = await this.bookingRepository.findOne(createInvoiceDto.bookingId);
      if (Object.keys(getBooking).length !== 0) {
        newPayment.booking = getBooking;
      } else {
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        this.apiResponse.errorMessage = "Booking is required";
        return this.apiResponse;
      }

      this.apiResponse.data = await this.invoiceRepository.save(newPayment);
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    this.apiResponse = new ResponseResult();
    try {
      const updateInvoice = this.invoiceRepository.create(updateInvoiceDto);
      const getInvoice = await this.invoiceRepository.findOne(id);
 
      // check payment method
      const getPaymentMethod = await this.paymentMethodRepository.findOne(updateInvoiceDto.paymentMethodId);
      if (Object.keys(getPaymentMethod).length === 0) {
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        this.apiResponse.errorMessage = "Payment method is required";
        return this.apiResponse;
      }

      if (Object.keys(getInvoice).length !== 0) {
        if (getInvoice.invoiceStatus == PaymentStatus.COMPLETED || getInvoice.invoiceStatus == PaymentStatus.FAILED) {
          this.apiResponse.status = HttpStatus.EXPECTATION_FAILED;
          this.apiResponse.errorMessage = "You cannot update processed invoice";
          return this.apiResponse;
        } else {
          updateInvoice.invoiceStatus = PaymentStatus.PROCESSING;
          updateInvoice.paymentMethod = getPaymentMethod;  
          await this.invoiceRepository.update({ id: id }, updateInvoice);
          this.apiResponse.data = await this.invoiceRepository.findOne(id);
        }
      }
      else {
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        this.apiResponse.errorMessage = "Invoice not found";
        return this.apiResponse;
      }
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
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
      if (Object.keys(getPayment).length !== 0) {
        if (getPayment.invoiceStatus == PaymentStatus.COMPLETED) {
          this.apiResponse.status = HttpStatus.EXPECTATION_FAILED;
          this.apiResponse.errorMessage = "Invoice has been processed";
          return this.apiResponse;
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
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        this.apiResponse.errorMessage = "Invoice not found";
        return this.apiResponse;
      }
    }
    catch (err) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findByorderNo(orderNo: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { orderNo: orderNo },
        relations: ['paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations', 'booking.carInfo', 'booking.driverInfo'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findCurrentPayment(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { userId: userId, invoiceStatus: PaymentStatus.PROCESSING },
        relations: ['paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations', 'booking.carInfo', 'booking.driverInfo'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findByUserId(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { userId: userId },
        relations: ['paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations', 'booking.carInfo', 'booking.driverInfo'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findOne(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.invoiceRepository.findOne({
        where: { id: id },
        relations: ['paymentMethod', 'booking', 'booking.trip', 'booking.trip.locations', 'booking.carInfo', 'booking.driverInfo'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
}
