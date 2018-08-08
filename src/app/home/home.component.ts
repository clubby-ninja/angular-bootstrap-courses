import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CoursesService } from '../_services/course/courses.service';
import { StudentsService } from '../_services/student/students.service';

import {MatDialog, MatDialogRef } from '@angular/material';
import { NewStudentComponent } from '../new-student/new-student.component';


import { Course } from '../_models/course';
import { Student } from '../_models/student';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private coursesSubscription: Subscription;
  private studentSubscription: Subscription;

  public courses: Course[];
  public students: Student[];

  private studentDialog: MatDialogRef<NewStudentComponent, any>;

  constructor(
    private courseService: CoursesService,
    private studentService: StudentsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.subscribeCourses();
    this.subscribeStudents();
  }

  ngOnDestroy(){
    this.unsubscribeCourses();
    this.unsubscribeStudents();
  }

  subscribeCourses(){
    /*if (this.coursesSubscription){
      return;
    }*/
    this.coursesSubscription = this.courseService.getCourses()
    .subscribe(
      (courses: Course[]) => {
        this.bindCourses(courses);
      },
      ((error: Error) => {
        console.log(error);
        this.bindCourses([]);
      })
    );

  }

  unsubscribeCourses(){
    if (this.coursesSubscription){
      this.coursesSubscription.unsubscribe();
      this.coursesSubscription = null;
    }
  }

  bindCourses(courses: Course[]){
    this.courses = courses;
  }

  subscribeStudents(){
    /*if (this.studentSubscription){
      return;
    }*/
    this.studentSubscription = this.studentService.getStudents()
    .subscribe(
      (students: Student[]) => {
        this.bindStudents(students);
      },
      ((error: Error) => {
        this.bindStudents([]);
        console.log(error);
      })
    );

  }

  unsubscribeStudents(){
    if (this.studentSubscription){
      this.studentSubscription.unsubscribe();
      this.studentSubscription = null;
    }
  }

  bindStudents(students: Student[]){
    this.students = students;
  }

  showStudentDialog(event: Event){
    event.preventDefault();
    this.studentDialog = this.dialog.open(NewStudentComponent, {
      width: '50vw',
      minWidth: '350px',
      data: {'type': NewStudentComponent.CREATE}
    });

    this.studentDialog.afterClosed()
      .subscribe(result => {
        if (result){
          this.subscribeStudents();
        }
      });
  }

  showDeleteAlert(event: Event, studentId: string){
    event.preventDefault();
    this.studentService.deleteStudent(studentId)
      .then((res: any) => {
        this.subscribeStudents();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

}
