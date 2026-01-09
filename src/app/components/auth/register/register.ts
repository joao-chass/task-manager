import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Auth } from '../../../services/auth/auth';
import { 
  faUserPlus, 
  faEnvelope, 
  faLock, 
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faInfoCircle,
  faUser,
  faCheck,
  faArrowLeft,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../models/user.model';
import { CryptoService } from '../../../services/crypto/crypto';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FaIconComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit  {
// Injeção de dependências
private fb = inject(FormBuilder);
private authService = inject(Auth);
private router = inject(Router);
private cryptoService = inject(CryptoService);

// Formulário
registerForm: FormGroup;

// Estados
errorMessage = signal('');
successMessage = '';
loading = signal(false);
showPassword = false;
showConfirmPassword = false;

// Ícones
faUserPlus = faUserPlus;
faEnvelope = faEnvelope;
faLock = faLock;
faExclamationTriangle = faExclamationTriangle;
faEye = faEye;
faEyeSlash = faEyeSlash;
faInfoCircle = faInfoCircle;
faUser = faUser;
faCheck = faCheck;
faArrowLeft = faArrowLeft;
faXmark = faXmark;

constructor() {
  this.registerForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$')
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });
}

ngOnInit(): void {
  // Verificar se há email salvo para preenchimento automático
  const savedEmail = localStorage.getItem('registerEmail');
  if (savedEmail) {
    this.registerForm.patchValue({ email: savedEmail });
  }
}

// Validador customizado para comparar senhas
passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  
  if (confirmPassword?.errors?.['passwordMismatch']) {
    delete confirmPassword.errors['passwordMismatch'];
    if (Object.keys(confirmPassword.errors).length === 0) {
      confirmPassword.setErrors(null);
    }
  }
  
  return null;
}

// Getter para facilitar acesso aos controles no template
get f() {
  return this.registerForm.controls;
}

// Verificar força da senha
getPasswordStrength(): string {
  const password = this.registerForm.get('password')?.value || '';
  
  if (password.length === 0) return '';
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasMinLength = password.length >= 8;
  
  const criteriaMet = [hasLowercase, hasUppercase, hasNumbers, hasMinLength].filter(Boolean).length;
  
  switch (criteriaMet) {
    case 4: return 'Forte';
    case 3: return 'Média';
    case 2: return 'Fraca';
    default: return 'Muito fraca';
  }
}

getPasswordStrengthClass(): string {
  const strength = this.getPasswordStrength();
  switch (strength) {
    case 'Forte': return 'bg-success';
    case 'Média': return 'bg-warning';
    case 'Fraca': return 'bg-danger';
    case 'Muito fraca': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
}

onSubmit(): void {
  if (this.registerForm.valid && !this.loading()) {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage = '';
    
    let { name, email, password } = this.registerForm.value;
    password = this.cryptoService.encrypt(password);
    const userData: User = {
      name,
      email,
      password,
      createdAt: new Date()
    };
    
    this.authService.register(userData).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
        
        console.log('Erro ao user:', user);
        localStorage.setItem('registerEmail', email);
        

        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        }, 2000);
      },
      error: (err) => {
       
        this.loading.set(false);
        
        if (err.status === 409) {
          this.errorMessage.set('Este email já está cadastrado. Tente fazer login ou use outro email.');
        } else if (err.status === 400) {
          this.errorMessage.set('Dados inválidos. Verifique as informações fornecidas.');
        } else {
          this.errorMessage.set('Erro ao criar conta. Por favor, tente novamente.');
        }
        
        console.error('Registration error:', err);
      }
    });
  } else {
 
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}


validateUpercaseLowercase(valueCompare: string) {
  if (!valueCompare) return true;
  
  return /[A-Z]/.test(valueCompare) && /[a-z]/.test(valueCompare);
}

validateNumber(valueCompare: string) {
  if (!valueCompare) return true;
  
  return /[0-9]/.test(valueCompare);
}


goToLogin(): void {
  this.router.navigate(['/login']);
}
}
