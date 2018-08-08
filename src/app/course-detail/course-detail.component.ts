import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CoursesService } from '../_services/course/courses.service'

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Course } from '../_models/course';
import { Student } from '../_models/student';

import {MatDialog, MatDialogRef } from '@angular/material';
import { NewStudentComponent } from '../new-student/new-student.component';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {

  private courseSubscription: Subscription;
  private course: Course = new Course();

  private studentDialog: MatDialogRef<NewStudentComponent, any>;

  constructor(
    private courseService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.subscribeCourse(this.route.snapshot.paramMap.get('id'));
  }

  ngOnDestroy() {
    this.unsubscribeCourse();
  }

  subscribeCourse(id: string){
    if (!id){
      this.router.navigate(['home']);
      return;
    }
    if (this.courseSubscription){
      return;
    }
    this.courseSubscription = this.courseService.getStudentInCourse(id)
    .subscribe(
      (course: Course) => {
        this.bindCourse(course);
      },
      ((error: Error) => {
        console.log(error);
      })
    );
  }

  unsubscribeCourse(){
    if (this.courseSubscription){
      this.courseSubscription.unsubscribe();
      this.courseSubscription = null;
    }
  }

  bindCourse(course: Course){
    this.course = course;
  }

  showStudentDialog(event: Event, course: Course){
    event.preventDefault();
    this.studentDialog = this.dialog.open(NewStudentComponent, {
      width: '2500px',
      data: {
        'type': NewStudentComponent.ADD_TO_COURSE,
        'course': course,
        'studentsId': course.students.map<string>((student: Student): string => {
          return student.id
        })
      }
    });

    this.studentDialog.afterClosed()
      .subscribe(result => {
        if (result){
          this.subscribeCourse(this.course.id);
        }
      });
  }

}
