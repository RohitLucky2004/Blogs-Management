import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'

@Schema()
export class BlogModel {
    @Prop()
    title: string
    @Prop()
    description: {
        "textId":string,
        "content":string,
        "formated":string
    }[]
    @Prop({default:[]})
    likes: string[]
    @Prop({default:false})
    isDeleted:string
    @Prop()
    comments: {
        comment_id: string,
        username: string,
        comment: string,
        commentLikes:string[],
        tags:string[],
        createdAt:Date,
        updatedAt:Date,
        parentComment:string
    }[]
    @Prop()
    files:{
        fileName:string,
        MIMEtype:string,
        data:string
    }[]

    @Prop()
    category:string[];
    @Prop()
    username: string
    @Prop({type:Date,default:Date.now()})
    createdAt:Date
    @Prop({type:Date,default:Date.now()})
    updatedAt:Date
}

export const blogSchema = SchemaFactory.createForClass(BlogModel)
