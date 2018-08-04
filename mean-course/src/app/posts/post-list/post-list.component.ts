import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";

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
    totalPosts = 10;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10]

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, 1);
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.isLoading = false;
                this.posts = posts;
            })
    }

    onChangedPage(pageEvent: PageEvent) {
        this.currentPage = pageEvent.pageIndex + 1;
        this.postsPerPage = pageEvent.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    onDelete(postId: string) {
        this.postService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }


}