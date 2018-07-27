import { Component, OnInit, OnDestroy } from "@angular/core";

import { PostService } from "src/app/post.service";
import { Post } from "src/app/post.model";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    private postSub: Subscription;
    posts = [];

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
            })
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }


}