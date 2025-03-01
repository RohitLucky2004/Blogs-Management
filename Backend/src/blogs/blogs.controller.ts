import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UsePipes, ValidationPipe, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UsersGuard } from 'src/users/Guards/users.guard';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dtos/blogs.dto';
import { QueryDto } from './dtos/query.sto';
import { SortDto } from './dtos/sort.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Controller('blog')
@UseGuards(UsersGuard)
export class BlogsController {
    constructor(private BlogServiceInstance: BlogsService) {}
    // used for creating a blog
    @Post('createBlog')
    @UsePipes(new ValidationPipe())
    async createBlog(@Param() params, @Body() blog: any) {
        console.log(blog);
        
       return await this.BlogServiceInstance.createBlog(params.user, blog);
    }

    // used  adding Comment to blog using Blog ObjectId
    @Post('comment/:blogId')
    AddComment(@Param() params, @Body('comment') comment) {
        const paremtComment="empty"
        return this.BlogServiceInstance.AddComment(params.blogId,params.user,comment,paremtComment);
    }

    // used  sub comments
    @Post('subComment/:blogId/:commentId')
    SubComments(@Param()params,@Body('comment')comment){
        return this.BlogServiceInstance.CommentReply(params.commentId,params.blogId,params.user,comment)
    }

//     @Post(':blogId/uploadFile')
//   @UseInterceptors(FilesInterceptor('files', 10, {limits: {fileSize: 10 * 1024 * 1024,},} as MulterOptions),)
//   createFile(@UploadedFiles() files: Express.Multer.File[], @Param() param) {
//     return this.BlogServiceInstance.createFile(files, param.blogId);
//     }

    // used  updating comment
    @Patch('updateComment/:blogid/:uuid')
    updateComment(@Param() Param, @Body('comment') comment: string) {
        return this.BlogServiceInstance.updateComment(Param.blogid,Param.user,Param.uuid,comment);
    }

    // used  updating blog using objID of blog
    @Patch('updateBlog/:blogId')
    update(@Param() params, @Body() blog: BlogDto) {
        return this.BlogServiceInstance.updateBlog(params.blogId,blog,);
    }

    // used adding Like to a Blog
    @Patch('Bloglike')
    addLike(@Body() body) {
        return this.BlogServiceInstance.BlogLike(body.id, body.username);
    }

    // used 
    @Get('commentLike/:blogId/:commentId/')
    commentLike(@Param() params){
        return this.BlogServiceInstance.CommentLikes(params.commentId,params.blogId,params.user)
    }

   // used  fetching Blog through blog ObjectId
    @Get('find/:ids')
    FindBlog(@Param() params) {      
        return this.BlogServiceInstance.FindBlog(params.ids);
    }
    
    // used 
    @Get('getComments/:blogId/:page/:limit')
    lazyComments(@Param() params){
        return this.BlogServiceInstance.getComments(params.blogId,params.page,params.limit)
    }

    // used 
    @Get('getTags')
    getTags(){
        return this.BlogServiceInstance.getAllTags();
    }

    @Get('commonLoad')
    async commonload(@Query('find')findQ:QueryDto,@Query('sort')sortQ:SortDto,@Query('skip')skip:number,@Query('limit')limit:number,@Param()param){
   return await this.BlogServiceInstance.commonLoad(findQ,sortQ,skip,limit=6,param.user)
    }

    @Post('search')
    async search(@Body()data:any){
   return await this.BlogServiceInstance.search(data.text,data.username)
    }
    // used 
    @Get('replies/:blogId/:parentId')
    replies(@Param() params){
        return this.BlogServiceInstance.getReplies(params.blogId,params.parentId)
    }

    // used                                                   
    @Delete('recovery/:blogId')
    async recoveryBlog(@Param() Params){
    return this.BlogServiceInstance.recoveryBlog(Params.blogId)
    }

    // used Deleting a Blog using Blog ObjectId
    @Delete('deleteBlog/:blogId')
    DeleteBlog(@Param() params) {
        return this.BlogServiceInstance.deleteBlog(params.user, params.blogId);
    }
    @Delete('deleteComment/:blogId/:cid')
    deleteComment(@Param() params){
        return this.BlogServiceInstance.deleteComment(params.blogId,params.cid)
    }

    // @Post()
    // uploadFile(@UploadedFile() file: Express.Multer.File) {
    //   console.log(file.filename);
    // }
    }

