import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit,OnDestroy {
  contactForm!: FormGroup;
  protected readonly title = signal('Priya Portfoli');


constructor(private fb: FormBuilder) {}

  private animationId: number = 0;
  
  ngOnInit() {
    this.initializeAnimations();
        this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }
  
  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  private initializeAnimations() {
    // Add floating animation to particles
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
      const element = particle as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;

    });
    
    // Add typing effect to name
    this.typewriterEffect();
  }
  
  private typewriterEffect() {
    const nameElement = document.querySelector('.typewriter');
    if (nameElement) {
      const text = 'Priya Tiwari';
      nameElement.textContent = '';
      
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          nameElement.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
    }
  }
  
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  openSocialLink(platform: string) {
    const links = {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      // twitter: 'https://twitter.com',
      // youtube: 'https://youtube.com',
      // instagram: 'https://instagram.com'
    };
    
    window.open(links[platform as keyof typeof links], '_blank');
  }

 sendEmail() {
    if (this.contactForm.invalid) {
      return;
    }

    emailjs.send(
      'service_nj44xwq',        // ✔ your service id
      'template_q7bec1v',      // ✔ your template id
      this.contactForm.value,  // form data
      'Z5-0QIXhvTjbQjBVl'      // ✔ your public key
    )
    .then((response) => {
      console.log("Email sent!", response);
      alert("Message sent successfully!");
      this.contactForm.reset();
    })
    .catch((error) => {
      console.error("Email :", error);
      alert("Failed to send message!");
    });
  }

  
}