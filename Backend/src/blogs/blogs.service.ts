import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserModel } from 'src/users/Schemas/users.schema';
import { v4 as uuidv4 } from 'uuid';
import { BlogDto } from './dtos/blogs.dto';
import { BlogModel, blogSchema } from './schemas/blog.schema';
import {of} from 'rxjs'
import { UUID } from 'bson';

@Injectable()
export class BlogsService {
    constructor
        (@InjectModel(UserModel.name)
        private UserModelInstance: Model<UserModel>,

            @InjectModel(BlogModel.name)
            private BlogModelInstence: Model<BlogModel>
        ){ };

    // creating a Blog of a user
    async createBlog(username:string, blog: BlogDto) {
        try {
        const user = await this.UserModelInstance.findOne({ username })
        // console.log(blog,username);
        blog.username = username;
        const Ublog = await new this.BlogModelInstence({ ...blog });
        const UUblog = await Ublog.save();
        await user.updateOne({ $push: { Blogs: UUblog._id }, });
         await user.save();
         return true;
        }
        catch (e) {
       return false;
        }
    }

    // updating blog using objID of blog
    async updateBlog(id: ObjectId, blog: BlogDto) {
        try {
            blog.updatedAt = new Date();
            blog.isDeleted=false;
            const Updatedblog = await this.BlogModelInstence.findByIdAndUpdate(id, blog, { new: true, runValidators: true })
            await Updatedblog.save()
            return true
        }
        catch (e) {
            return false
        }
    }

    // fetching Blog through blog ObjectId
    async FindBlog(id: ObjectId) {
        try {
            const blog = await this.BlogModelInstence.findById(id)
            // blog.comments=this.getComments(blog._id)
           // console.log(blog, id);
            if (!blog) throw new NotFoundException(`${id} does not exist`)
            return blog;
        }
        catch (e) {
            return false;
        }
    }

    // Deleting a Blog using Blog ObjectId
    async deleteBlog(username: string, id: ObjectId) {
        try {
            // console.log('try-Block');
            const blog = await this.BlogModelInstence.findById(id)
            // console.log(blog);
            if (blog) {
                if (blog.username != username) return false;
                // console.log("deletion:",id);
                
                const user = await this.UserModelInstance.findOne({ username })
                await user.updateOne({
                    $pull: {
                        Blogs: id
                    }
                })
                user.save()
                await this.BlogModelInstence.findByIdAndDelete(id);
                // console.log(user);
                
                return true;
            }
        }
        catch (e) {
         return false
        }
    }

    // adding Like to a Blog
    async BlogLike(id: ObjectId, username: string) {
        try {
            const blog = await this.BlogModelInstence.findById(id);
            if (blog.likes.includes(username)) {
                const index = blog.likes.indexOf(username)
                blog.likes.splice(index, 1);
                blog.save();
                return true;

            }
            else {
                await blog.likes.push(username);
                await blog.save();
            //    console.log(blog.likes, blog);
                return true;
            }
        }
        catch (e) {
            return false;
        }
    }

    // removing database data
    dropBlog() {
        try {
            return this.BlogModelInstence.collection.drop()
        }
        catch (e) {
            return false;
        }
    }
    // retriving all blogs of a user
    async userBlogs(username: string) {
        try {
            const userBlogs = await this.BlogModelInstence.find({ username }).sort({ createdAt: -1}).exec();
            if (userBlogs)
                return userBlogs;
            return false
        }
        catch (e) {
            return false
        }
    }

    // adding Comment to blog using Blog ObjectId
    async AddComment(id: ObjectId, username: string, comment: string,parentComment:string) {
        try {
            const genUUID = uuidv4()
            const uuid: string = genUUID.toString()
            const comment_likes: string[] = [];
            const tags: string[] = [];
            const commentObj = { 'comment_id': uuid, 'username': username, "comment": comment, "commentLikes": comment_likes, 'tags': tags , 'createdAt':new Date(), 'updatedAt':new Date(),'parentComment':parentComment};
            const blog = await this.BlogModelInstence.findById(id);
            await blog.updateOne({
                $push: {
                    comments: commentObj
                }
            })
            await blog.save();
            return commentObj;
        }
        catch (e) {
     return false;
        }
    }

    //updating comment using uuid
    async updateComment(blogId: ObjectId, username: string, uuid: string, newComment: string) {
        // console.log(uuid);
        const blog = await this.BlogModelInstence.findOneAndUpdate({_id:blogId,
            'comments.comment_id':uuid,},
            {
                $set:{'comments.$.comment':newComment,},
            },
            {new:true},
        );
        return true;
    }

    // deleting comment using genUUID of blog ObjectId
    // async deleteComment(username: string, id: ObjectId, uuid: string) {
    //     try {
    //         const blog = await this.BlogModelInstence.findById(id);
    //         if (username != blog.username) return "You doesn't have access"
    //         const index = await blog.comments.findIndex(obj => obj.comment_id == uuid)
    //     //    console.log(index)
    //         blog.comments.splice(index, 1);
    //         blog.save()
    //         return true;
    //     }
    //     catch (e) {
    //        return false
    //     }
    // }

    // deleting user Blogs 
    async deleteUserBlogs(username: string) {
        try {
            const blogs = await this.BlogModelInstence.deleteMany({ username });
            if (!blogs) return 'no blogs to delete';
            return await this.UserModelInstance.findOneAndUpdate({ username }, { Blogs: [] });
        }
        catch (e) {
        return false
        }
    }


    async CommentLikes(commentId: string, blog_id: ObjectId, username: string) {
        var blog = await this.BlogModelInstence.findById(blog_id);      
        const index = blog.comments.findIndex(item => item.comment_id === commentId);
        var comment = blog.comments[index];
        const user_index = comment.commentLikes.indexOf(username)
    //    console.log(index, user_index,username);
        if (user_index >=0){comment.commentLikes.splice(user_index,1)
            // console.log(comment);
        }
        else {
            comment.commentLikes.push(username);
        }
        blog.comments[index] = comment;
      await blog.save()
    //   console.log("----------------------",await blog.comments[index]);
      
        return true;
    }

    async CommentReply(reply_id: string, blogId: ObjectId, username: string, text: string) {
        const commentObj = await this.AddComment(blogId, username, text,reply_id);
        const blog = await this.BlogModelInstence.findById(blogId);
        const index = blog.comments.findIndex(item => item.comment_id === reply_id);
        const commentArr = blog.comments[index];
        // console.log(commentArr,"----",commentObj);
        
        commentArr.tags.push(commentObj['comment_id']);
        blog.comments[index] = commentArr;
         await blog.save()
         return true;
    }

    async getallBlogs() {
        try {
            const blogs = await this.BlogModelInstence.find({isDeleted:false});
            if (blogs) return blogs;
            return blogs;
        }
        catch (e) {
           return false;
        }
    }

    async getComments(blogId,page,limit) {
        // try{
       // console.log(blogId);
       const startIndex=(page-1)*limit;
        const endIndex=(page*limit)
        const blog = await this.BlogModelInstence.findById(blogId);
        var comments=[]
        blog.comments.forEach((item)=>{
            if(item.parentComment=="empty")
            comments.push(item)
        })
        const comm=comments.reverse().slice(startIndex,endIndex)
        return comm;
    }
    async getSubComments(blogId:ObjectId,comment_id:UUID){
       const subComments=this.BlogModelInstence.find({_id:blogId,comments:{tags:comment_id}})
       return subComments;
    }

    countBlogs() {
        return this.BlogModelInstence.countDocuments();
    }

    getBlogByTag(key: string) {
        const blogs = this.BlogModelInstence.find({ category: key })
        return blogs
    }
    async getAllTags(){
      const tagsObjects=await this.BlogModelInstence.find().select('category').exec();
        const categories=[...new Set(tagsObjects.map(i=>i.category).flat())]
        return categories
    }

    async commonLoad(findQ:object|any,sortQ:object|any,startIndex:number,limit:6,username:string){  
        findQ=JSON.parse(findQ) 
        sortQ=JSON.parse(sortQ)
         console.log(findQ,sortQ,startIndex,limit,typeof(sortQ));
        // const blogs=await this.BlogModelInstence.find(findQ).sort(sortQ).skip((startIndex-1)*6).limit(limit+1).exec()
        const blogs=await this.BlogModelInstence.aggregate([
            {$match:findQ},
             {$addFields:{likesCount:{$size:'$likes'}}},
             {$sort:sortQ},
             {$skip:(startIndex-1)*6},
             {$limit:6+1}
        ])
        if(blogs.length>limit)return {blog:blogs.slice(0,6),noMore:false};
        return {blog:blogs,noMore:true}
    }
    async search(text:string,username:string){
        var blogs:any=[]
        if(username!='^^&&^'){
        blogs=await this.BlogModelInstence.find({
            $or:[
                {title:{$regex:text,$options:'i'}},
                {category:{$regex:text,$options:'i'}},
                {username:{$regex:text,$options:'i'}},
            ],
            username:username
        }).exec()}
    else{
        blogs=await this.BlogModelInstence.find({
            $or:[
                {title:{$regex:text,$options:'i'}},
                {category:{$regex:text,$options:'i'}},
                {username:{$regex:text,$options:'i'}},
            ],
        }).exec()}
    return {blog:blogs,noMore:true}
    }

    async recoveryBlog(id:ObjectId){
        try{var blog=await this.BlogModelInstence.findById(id);
            var user=await this.UserModelInstance.findOneAndUpdate({username:blog.username},{
                $pull:{Blogs:id}
            });
            // console.log(user);
        blog.isDeleted='true';
        await blog.save()
        return true;}
        catch{
            return false;
        }
    }
    async getReplies(blogId:string,parentId:string){
        const blog=await this.BlogModelInstence.findById({_id:blogId})
        var replies:any=[]
        blog.comments.forEach((item)=>{
            if(item.parentComment==parentId){
                replies.push(item);
            }
        })
        return replies
    }
    // async createFile(files:Express.Multer.File[],blogId:string){
    //     const uploadFile = files.map(async file=>{
    //       const {originalname,mimetype,buffer} = file;
    //       const fileObj={"fileName":originalname,"MIMEtype":mimetype,"data":buffer.toString('base64')}
    //       var blog=await this.BlogModelInstence.findById(blogId)
    //       blog.files.push(fileObj)
    //       blog.save()
    //       return blog
    //   } ) }

comments=[]
    async deleteComment(blogId:string,commentId:string){
        var blog=await this.BlogModelInstence.findById(blogId)
         this.comments=blog.comments
         this.rec(commentId);
         console.log(this.comments);
         return this.comments
    }
    rec(cid:string){
       var  delComment:any={}
       var index=-1
        for(let i=0;i<this.comments.length;i++ ) {
        if(this.comments[i].parentComment==cid && this.comments[i].tags.length>0){
            this.rec(this.comments[i].comment_id)   
        }
        else if(this.comments[i].parentComment==cid && this.comments[i].tags.length==0){
            this.comments.splice(i,1);
            i=0;
        }
        else if(this.comments[i].comment_id==cid && this.comments[i].tags.length==0){ 
            this.comments.splice(index,1);
            i=0;
            break;
        }
    }
 
    return this.comments
}

}