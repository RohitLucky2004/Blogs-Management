import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../app.service';
import { CustomPipe } from '../../../custom.pipe';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, CustomPipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() comment!: any;
  @Input() level!: number;
  @ViewChild('RC', { static: true }) RC!: ElementRef;
  @ViewChild('CI', { static: true }) CI!: ElementRef;
  @ViewChild('UC') UC!: ElementRef;

  cancelEdit(comment_id: string) {
    this.showEdit[comment_id] =false
  }
  replies: any = []
  replyBtnVisible = false
  editBtnVisible = false
  showEdit: { [key: string]: boolean } = {};
  showReply: { [key: string]: boolean } = {};
  constructor(private service: AppService, private toastr: ToastrService, private router: Router) { }
  comments: any[] = []
  blogId: string | any;
  username: any
  isSeeMore: boolean = false
  page = 1
  editingComment: any = null
  replyingTo: any = null
  limit = 6
  ngOnInit() {
    this.blogId = sessionStorage.getItem('blogId');
    this.username = sessionStorage.getItem('username')
    this.loadComments();
  }
  loadComments(){
    this.service.getComments(this.blogId, this.page, this.limit).subscribe((res: any) => {
      // console.log("res",res);
      this.comments += res
      this.page += 1

    })
  }
  commentLike(CommentId: string) {
    this.service.commentLike(this.blogId, CommentId).subscribe(async (res: any) => {
      if (await res == true) {
        this.page = 1
        this.loadComments()
      }
      else {
        this.toastr.error("try again")
      }
    })
  }

  onEdit(comment_id: string, comment: string) {
    this.showEdit[comment_id] = !this.showEdit[comment_id]
  }

  saveComment(comment_id: string) {
    const ucomment = this.UC.nativeElement.value.trim();
    // console.log(ucomment);
    this.showEdit[comment_id] = !this.showEdit[comment_id]
    this.service.updateComment(comment_id, ucomment, this.blogId).subscribe((res: any) => {
      if (res == true) {
        this.toastr.success("updated click refresh button")
        this.showEdit[comment_id] = !this.showEdit[comment_id]
      }
      else {
        this.toastr.error("try again")
      }
    })

  }
  showReplyEdit(comment: any) {
    this.replyBtnVisible = !this.replyBtnVisible
    const curr = new Date()
    const user = sessionStorage.getItem('username')
    const commentCreatedAt = new Date(comment.createdAt)
    const creationTime = curr.getTime() - commentCreatedAt.getTime()
    if ((creationTime / (1000 * 60)) <= 5 && user == comment.username) {
      this.editBtnVisible = !this.editBtnVisible
    }

  }
  async onReply(comment_id: string) {
    this.showReply[comment_id] = !this.showReply[comment_id]
    this.replies = this.service.getReplies(this.blogId, comment_id).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.replies = res
      }
    }
    )
  }
  reply(tagId: string, newComment: string) {
    if (newComment) {
      this.service.tagComment(this.blogId, newComment, tagId).subscribe(async (res: any) => {
        if (res == true) {
          this.toastr.success("comment added")
          this.showReply[tagId] = !this.showReply[tagId]
          this.onReply(tagId);
        }
        else {
          this.toastr.error("refresh /try again")
        }
      })
    }
  }

}
