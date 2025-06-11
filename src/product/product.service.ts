import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { title, description, img_url_1 } = createProductDto;
    const newProduct = this.productRepository.create({
      ...createProductDto,
    });
    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    const findProduct = await this.productRepository.findOneBy({ id });
    if (!findProduct) {
      throw new HttpException('No product found !!', HttpStatus.NOT_FOUND);
    }

    return findProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {
      title,
      description,
      img_url_1,
      price,
      quantity,
      size,
      color,
      shippings,
      sex,
      brands,
      category,
      subcategory,
    } = updateProductDto;
    const findProduct = await this.productRepository.findOneBy({ id });

    if (!findProduct) {
      throw new HttpException('No product found !!', HttpStatus.NOT_FOUND);
    }

    let updateProduct: any = {};

    title && (updateProduct.title = title);
    description && (updateProduct.description = description);
    img_url_1 && (updateProduct.img_url_1 = img_url_1);

    price && (updateProduct.price = price);
    quantity && (updateProduct.quantity = quantity);
    size && (updateProduct.size = size);
    color && (updateProduct.color = color);

    shippings && (updateProduct.shippings = shippings);
    sex && (updateProduct.sex = sex);
    brands && (updateProduct.brands = brands);
    category && (updateProduct.category = category);
    subcategory && (updateProduct.subcategory = subcategory);

    await this.productRepository.update({ id }, updateProduct);

    const findProductAgain = await this.productRepository.findOneBy({ id });

    return findProductAgain;
  }

  async remove(id: string) {
    const findProduct = await this.productRepository.findOneBy({ id });
    if (!findProduct) {
      throw new HttpException('No product found !!', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.remove(findProduct);
    return id + 'this product is deleted';
  }

  async findProductsByCategory(name: string) {
    const findProduct = await this.productRepository
      .createQueryBuilder('product')
      .where('product.subcategory = :name', { name })
      .getMany();
    
    return findProduct;
  }
}
