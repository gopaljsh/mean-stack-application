import { Component, OnInit, OnDestroy } from "@angular/core";

import { PostService } from "../post.service";
import { Post } from "../post.model";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    private postSub: Subscription;
    posts = [];
    isLoading = false;

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.isLoading = false;
                this.posts = posts;
            })
    }

    onDelete(postId: string) {
        this.postService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }


}