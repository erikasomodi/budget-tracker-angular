import { AuthService, userAuthData } from "./../../services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { UserService } from "../../services/user.service";
import { UserModel } from "../../models/user.model";
import { Subscription, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrl: "./registration.component.scss",
})
export class RegistrationComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;

  activatedParamsSubscription?: Subscription;
  activatedGetSubscription?: Subscription;
  saveSubscription?: Subscription;
  updateSubscription?: Subscription;
  authRegSubscription?: Subscription;
  authLoginSubscription?: Subscription;

  showPassword: boolean = false;
  faEye: IconProp = faEye;
  faEyeSlash: IconProp = faEyeSlash;

  updateUserId?: string | null;
  createUserId?: string | null | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  //plusz validátorok még kellenek!
  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [
        Validators.required,
        this.adminEmailValidator,
        this.googleEmailValidator,
      ]),
      password: new FormControl("", [Validators.required]),
      age: new FormControl("", [Validators.required]),
      married: new FormControl("", [Validators.required]),
      numberOfChildren: new FormControl(null, [Validators.required]),
      startBudget: new FormControl("", [Validators.required]),
      monthlySalary: new FormControl("", [Validators.required]),
    });

    //* SHOW OF REGISTRATION DATA
    this.activatedParamsSubscription = this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const userId = params.get("id");
        if (userId) {
          this.updateUserId = userId;
          this.activatedGetSubscription = this.userService
            .getUserWithGetDoc(userId)
            .subscribe({
              next: (data) => {
                this.userForm.patchValue(data);
                this.updateUserId = data.id;
              },
            });
        }
      },
    });
  }

  //* TOGGLE PASSWORD
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  //* CREATE USER

  handleSubmit() {
    if (this.userForm.valid) {
      this.authRegSubscription = this.registration().subscribe({
        next: () => {
          this.saveUser();
        },
        error: (error) => {
          console.error("Error during registration:", error);
        },
      });
    } else {
      console.error("Form is invalid");
    }
  }

  saveUser(): void {
    const user: UserModel = this.userForm.value;
    //* CREATE
    this.saveSubscription = this.userService
      .createUserWithId(this.createUserId, user)
      .subscribe({
        next: () => {
          console.log("User created!");
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.userForm.reset();
    this.createUserId = undefined;
  }
  // //* UPDATE
  updateUser(): void {
    const user: UserModel = this.userForm.value;
    this.userService.getUserWithGetDoc(this.updateUserId).subscribe((data) => {
      const oldUser = data;
      user != oldUser;
    });
    this.updateSubscription = this.userService.updateUser(user).subscribe({
      next: () => {
        this.toastr.success("User updated successfully!");
      },
    });
    this.userForm.reset();
    this.updateUserId = undefined;
  }

  //* USER REGISTRATION, LOGIN
  registration() {
    console.log();
    const regData = this.userForm.value;
    return this.authService.registration(regData).pipe(
      tap({
        next: (userCredential) => {
          this.toastr.success(`${regData.name}'s registration was successful!`);
          this.createUserId = userCredential.user.uid;
          console.log("User registered:", userCredential.user.uid);
        },
        error: (error) => {
          console.error("Registration error:", error);
        },
        complete: () => {},
      })
    );
  }

  //* CUSTOM VALIDATOR

  adminEmailValidator(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;

    if (controlValue != null) {
      return controlValue.match(/admin/i)
        ? { admin: { value: control.value + "Error: contain admin" } }
        : null;
    }
    return null;
  }
  googleEmailValidator(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;

    if (controlValue != null) {
      return controlValue.match(/gmail/i)
        ? { gmail: { value: control.value + "Error: contain gmail" } }
        : null;
    }
    return null;
  }

  //* GETTEREK

  get name(): AbstractControl | null {
    return this.userForm.get("name");
  }
  get email(): AbstractControl | null {
    return this.userForm.get("email");
  }
  get password(): AbstractControl | null {
    return this.userForm.get("password");
  }
  get age(): AbstractControl | null {
    return this.userForm.get("age");
  }
  get married(): AbstractControl | null {
    return this.userForm.get("married");
  }
  get numberOfChildren(): AbstractControl | null {
    return this.userForm.get("numberOfChildren");
  }
  get startBudget(): AbstractControl | null {
    return this.userForm.get("startBudget");
  }
  get monthlySalary(): AbstractControl | null {
    return this.userForm.get("monthlySalary");
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.authRegSubscription) {
      this.authRegSubscription.unsubscribe();
    }
    if (this.authLoginSubscription) {
      this.authLoginSubscription.unsubscribe();
    }
    if (this.activatedParamsSubscription) {
      this.activatedParamsSubscription.unsubscribe();
    }
    if (this.activatedGetSubscription) {
      this.activatedGetSubscription.unsubscribe();
    }
  }
}
