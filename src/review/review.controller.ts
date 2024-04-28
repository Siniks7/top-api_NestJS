/* eslint-disable no-mixed-spaces-and-tabs */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'; // Ошибка импорта
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService
	) { }

  @UsePipes(new ValidationPipe())
  @Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

  @UsePipes(new ValidationPipe())
	@Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
  	const message = `Имя: ${dto.name}\n`
			+ `Заголовок: ${dto.title}\n`
			+ `Описание: ${dto.description}\n`
			+ `Рейтинг: ${dto.rating}\n`
			+ `ID Продукта: ${dto.productId}`;
  	return this.telegramService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard)
	@Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) { const deletedDoc = await this.reviewService.delete(id);if (!deletedDoc) {throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
  }}

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {return this.reviewService.findByProductId(productId);
  }
  
   @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteByProductId(@Param('id', IdValidationPipe) productId: string) { const deletedDoc = await this.reviewService.deleteByProductId(productId);if (!deletedDoc) {throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
  }}


}
