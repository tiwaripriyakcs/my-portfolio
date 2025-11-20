import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit,OnDestroy {
  protected readonly title = signal('Priya Portfoli');




  private animationId: number = 0;
  
  ngOnInit() {
    this.initializeAnimations();
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
  
}