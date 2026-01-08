import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faExclamationTriangle = faExclamationTriangle;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSignInAlt = faSignInAlt;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/tasks']);
          } else {
            this.errorMessage = 'Credenciais inválidas';
          }
        },
        error: () => {
          this.errorMessage = 'Erro ao fazer login';
        }
      });
    }
  }
}
