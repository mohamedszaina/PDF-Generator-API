import { Injectable } from '@nestjs/common';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc } from './entities/doc.entity';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class DocsService {
  constructor(@InjectModel('Doc') private readonly docModel: Model<Doc>) {}
  async create(createDocDto: CreateDocDto): Promise<Doc> {
    const createdDoc = new this.docModel(createDocDto);
    const result = await createdDoc.save();
    return result;
  }

  async findAll(): Promise<Doc[]> {
    return this.docModel.find().exec();
  }

  async findOne(id: string) {
    const result = await this.docModel.findById({ _id: id }).exec();
    console.log(result);
    return result;
  }

  async generatePdfContent(result: any): Promise<Buffer> {
    const doc = new PDFDocument({
      size: 'LETTER',
      bufferPages: true,
      autoFirstPage: false,
    });

    let pageNumber = 0;
    doc.on('pageAdded', () => {
      pageNumber++;
      const bottom = doc.page.margins.bottom;

      doc.page.margins.bottom = 0;
      doc.font('Helvetica').fontSize(14);
      doc.text(
        'page ' + pageNumber,
        0.5 * (doc.page.width - 100),
        doc.page.height - 50,
        {
          width: 100,
          align: 'center',
          lineBreak: false,
        },
      );
      doc.page.margins.bottom = bottom;
    });

    doc.addPage();
    doc.text('', 50, 70);
    doc.fontSize(24);
    doc.moveDown();
    doc.font('Helvetica').fontSize(20);
    doc.text('PDF Generator', {
      width: doc.page.width - 100,
      align: 'center',
    });

    const tableOne = {
      title: 'Identification of “Product”',
      subtitle: `ID: ${result.id}`,
      headers: ['Identification ', 'description'],
      rows: [
        ['Description of Product:', result.DescriptionofProduct],
        ['Vendor PO Number:', result.VendorPONumber],
      ],
    };

    await doc.table(tableOne, {
      columnsSize: [150, 350],
    });
    // Return the PDF content as a buffer
    return new Promise((resolve) => {
      const buffers: Buffer[] = [];
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.end();
    });
  }

  async pdfGenerate(id: string): Promise<Buffer> {
    const result = await this.docModel.findById({ _id: id }).exec();
    const pdfContent = await this.generatePdfContent(result);
    return pdfContent;
  }

  update(id: string, updateDocDto: UpdateDocDto) {
    return `This action updates a #${id} doc`;
  }

  async remove(id: string) {
    const docDeleted = await this.docModel.findOneAndRemove({ _id: id }).exec();
    return docDeleted;
  }
}
