import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode:string = 'create';
  private postId: string;
  private post: Post;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    if(this.mode === 'edit') {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    } else {
      this.postService.addPost(form.value.title, form.value.content);
    }
    form.resetForm();
  }

}
