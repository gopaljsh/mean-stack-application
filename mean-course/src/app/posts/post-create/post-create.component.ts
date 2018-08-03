import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode:string = 'create';
  private postId: string;
  private post: Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  
  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe((post) => {
            this.isLoading = false;
            this.post = {id: post._id, title: post.title, content: post.content, imagePath: null};
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; 
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title, 
        this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

}
