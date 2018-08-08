import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { StudentsService } from '../_services/student/students.service';
import { CoursesService } from '../_services/course/courses.service';
import { Student } from '../_models/student';
import { Course } from '../_models/course';

import { Utils } from '../util/util';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.scss']
})
export class NewStudentComponent implements OnInit, OnDestroy {
  public static CREATE = 0;
  public static MODIFY = 1;
  public static ADD_TO_COURSE = 2;

  public errors: any = {
    'first_name': {'verifications': ['empty'], errors: []},
    'last_name': {'verifications': ['empty'], errors: []},
    'last_name_second': {'verifications': ['empty'], errors: []},
    'email': {'verifications': ['empty', 'email'], errors: []},
    'phone': {'verifications': ['empty'], errors: []},
    'birth_date': {'verifications': ['empty'], errors: []},
  }

  public student: Student;
  public isCreate: boolean;
  public isAddToCourse: boolean;

  private studentSubscription: Subscription;

  public students: Student[];
  public studentsInCourse: {} = {};
  public course: Course;

  constructor(
    public dialogRef: MatDialogRef<NewStudentComponent>,
    private studentService: StudentsService,
    private courseService: CoursesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.student = this.data.student?this.data.student:new Student();
    this.course = this.data.course?this.data.course:new Course();
    this.isCreate = this.data.type == NewStudentComponent.CREATE;
    this.isAddToCourse = this.data.type == NewStudentComponent.ADD_TO_COURSE;

    //sets the students in the course
    if (this.data.studentsId){
      (this.data.studentsId as string[]).forEach((value: string) => {
        this.studentsInCourse[value] = 1;
      });
    }

    if (this.isAddToCourse){
      this.subscribeStudents();
    }
  }

  ngOnDestroy(){
    if (this.isAddToCourse){
      this.unsubscribeStudents();
    }
  }
  subscribeStudents(){
    this.studentSubscription = this.studentService.getStudents()
    .subscribe(
      (students: Student[]) => {
        console.log(students);
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
    let toAdd: Student[] = [];
    students.forEach((element: Student) => {
      if (!this.studentsInCourse[element.id]){
        toAdd.push(element);
      }
    });
    this.students = toAdd;
    this.student = this.students.length > 0 ?this.students[0]: null;
  }
  onSubmit(event: Event, student: Student){
    event.preventDefault();
    switch(this.data.type) {
      case NewStudentComponent.CREATE:
      this.addStudent(student)
      break;
      case NewStudentComponent.MODIFY:
      this.modifyStudent(student)
      break;
      case NewStudentComponent.ADD_TO_COURSE:
      this.addStudentToCourse(student, this.course)
      break;
      default:
      console.log('action not recognized');
    }
  }

  addStudent(student: Student){
    if (!this.checkValidations(student)){
      return;
    }

    this.studentService.addNewStudent(student)
      .then((res: any) => {
        this.closeDialog(true);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  modifyStudent(student: Student){
    if (!this.checkValidations(student)){
      return;
    }

    this.studentService.editStudent(student)
      .then((res: any) => {
        this.closeDialog(true);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  addStudentToCourse(student: Student, course: Course){
    if (!course || !course.id){
      console.log('No Course');
      return;
    }
    if (!student || !student.id){
      alert('Please select or add an student');
      return;
    }
    this.courseService.addStudentToCourse(course.id, student.id)
      .then((res: any) => {
        this.closeDialog(true);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  checkValidations(student: Student): boolean{
    let isOk = true;

    Object.keys(this.errors).forEach((inputKey)=> { //every input
      //clears error before verify again
      this.errors[inputKey].errors = [];
      this.errors[inputKey].verifications.forEach((verification) => { //every verification
        switch(verification) {
          case 'empty':
          if (Utils.isEmpty(student[inputKey])){ //empty
            isOk = false;
            this.errors[inputKey].errors.push("Cannot be null");
          }
          break;
          case 'email':
          if (!Utils.isEmail(student[inputKey])){ //not email
            isOk = false;
            this.errors[inputKey].errors.push("Email incorrect");
          }
          break;
        }
      })
    });
    console.log(this.errors);

    return isOk;
  }

  studentSelected(event: Event){
  }

  closeDialog(didSuccess: boolean) {
    this.dialogRef.close(didSuccess);
  }

}
