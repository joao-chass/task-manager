import { Component, signal } from '@angular/core';
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
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    FaIconComponent,
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  
  loginForm: FormGroup;

  loading = signal(false);
  errorMessage = signal('');
  

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

  rigisterRoute() {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      
      setTimeout(() => {
 
      this.loading.set(false);
        
     
        const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/task']);
          } else {
            this.errorMessage.set('Credenciais inválidas');
          }
        },
        error: () => {

          this.errorMessage.set('Erro ao fazer login');
        }
      });
        
      }, 500);
      
    }
  }
}
