import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tags-test',
  imports: [],
  templateUrl: './tags-test.component.html',
  styleUrl: './tags-test.component.css'
})
export class TagsTestComponent implements OnInit {
  tags: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.tags = params.getAll('tags');
    });
  }
}