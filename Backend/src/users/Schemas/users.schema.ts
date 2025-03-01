import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BlogModel } from 'src/blogs/schemas/blog.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserModel {
    @Prop({required:true})
    nickname:string;

    @Prop({ unique: true, required: true })
    username: string;

    @Prop()
    password: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogModel' }] })
    Blogs: BlogModel;
}

export const userSchema = SchemaFactory.createForClass(UserModel)

