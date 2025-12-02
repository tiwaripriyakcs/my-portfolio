import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs'; 
import { takeUntil } from 'rxjs/operators'; 
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  protected readonly title = signal('Priya Portfolio');
  
  private animationId: number = 0;
  private destroy$ = new Subject<void>();
  
  // Properties for UX Logic
  private skillsViewed: boolean = false;
  private hintIntervalId: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeAnimations();
    this.setupScrollListener();
    this.setupScrollHint();
    this.setupScrollToTop();

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
    this.destroy$.next();
    this.destroy$.complete();
    if (this.hintIntervalId) {
      clearInterval(this.hintIntervalId);
    }
  }

  // --- SCROLL LISTENER FOR SKILLS ---
  private setupScrollListener() {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkSkillsSectionVisibility();
      });
  }

  private checkSkillsSectionVisibility() {
    const skillsSection = document.getElementById('skillsSection');
    if (skillsSection && !this.skillsViewed) {
      const rect = skillsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible) {
        this.skillsViewed = true;
        this.applySkillAnimation();
        this.hideScrollHint();
      }
    }
  }

  private applySkillAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
      (card as HTMLElement).style.animationDelay = `${index * 0.1}s`;
      card.classList.add('in-view');
    });
  }

  // --- SCROLL HINT LOGIC ---
  private setupScrollHint() {
    setTimeout(() => this.showScrollHint(5000), 5000); 

    this.hintIntervalId = setInterval(() => {
      if (!this.skillsViewed) {
        this.showScrollHint(5000);
      }
    }, 60000);
  }

  private showScrollHint(durationMs: number) {
    const hint = document.getElementById('scrollHint');
    if (hint && !this.skillsViewed) {
      hint.style.opacity = '1';
      hint.style.visibility = 'visible';

      setTimeout(() => {
        if (!this.skillsViewed) {
          this.hideScrollHint();
        }
      }, durationMs); 
    }
  }

  private hideScrollHint() {
    const hint = document.getElementById('scrollHint');
    if (hint) {
      hint.style.opacity = '0';
      hint.style.visibility = 'hidden';
    }
  }
  
  // --- SCROLL TO TOP BUTTON ---
  private setupScrollToTop() {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        if (scrollBtn) {
          if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
          } else {
            scrollBtn.classList.remove('show');
          }
        }
      });

    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // --- INITIALIZATION ---
  private initializeAnimations() {
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
      const element = particle as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;
    });
    
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
  
  // --- NAVIGATION ---
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  openSocialLink(platform: string) {
    const links: { [key: string]: string } = {
      linkedin: 'https://www.linkedin.com/in/priya-tiwari-your-profile',
      github: 'https://github.com/your-username',
    };
    
    const url = links[platform];
    if (url) {
      window.open(url, '_blank');
    }
  }

  // --- EMAIL FUNCTIONALITY ---
  sendEmail() {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    emailjs.send(
      'service_nj44xwq',
      'template_q7bec1v',
      {
        from_name: this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        message: this.contactForm.value.message
      },
      'Z5-0QIXhvTjbQjBVl'
    )
    .then((response) => {
      console.log("Email sent successfully!", response);
      alert("Message sent successfully! I'll get back to you soon.");
      this.contactForm.reset();
    })
    .catch((error) => {
      console.error("Email send failed:", error);
      alert("Failed to send message. Please try again or contact me directly.");
    });
  }
}