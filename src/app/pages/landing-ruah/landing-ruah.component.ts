import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PackagesService } from 'src/app/core/services/packages.service';
import { PackagePlan } from 'src/app/shared/packages.constants';
import { Local, LocaisService } from 'src/app/core/services/locais.service';

@Component({
  selector: 'app-landing-ruah',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './landing-ruah.component.html',
  styleUrls: ['./landing-ruah.component.scss'],
  providers: [PackagesService, LocaisService],
})
export class LandingRuahComponent implements OnInit, AfterViewInit {
  packages: PackagePlan[] = [];
  loadingPackages = true;

  locais: Local[] = [];
  loadingLocais = true;

  trialSent = false;
  trialWhatsAppLink = '';

  faqItems = [
    {
      question: 'Nunca dancei, posso começar na Ruah?',
      answer: 'Com certeza! Temos turmas específicas para iniciantes onde focamos na base técnica e no acolhimento do aluno. Não é necessária experiência prévia.',
      isOpen: false
    },
    {
      question: 'Preciso de um par para as aulas?',
      answer: 'Não. Nossas aulas de Jazz Contemporâneo e Danças Urbanas são focadas no desenvolvimento individual e em grupo, sem necessidade de par.',
      isOpen: false
    },
    {
      question: 'Como funciona a aula experimental?',
      answer: 'Oferecemos uma aula experimental gratuita para que você conheça nossa metodologia, os professores e o ambiente da escola antes de se matricular.',
      isOpen: false
    },
    {
      question: 'Quais os locais das aulas em Curitiba?',
      answer: 'Atualmente temos unidades em paróquias estratégicas de Curitiba e studio parceiro. Verifique a seção de unidades para o endereço mais próximo de você.',
      isOpen: false
    }
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private packagesService: PackagesService,
    private locaisService: LocaisService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Ruah | Dança e Profecia - Escola de Dança Católica em Curitiba');

    this.metaService.addTags([
      { name: 'description', content: 'Escola de dança Ruah em Curitiba - Transformando vidas através da dança e profecia. Jazz Contemporâneo, Danças Urbanas e formação católica. Agende sua aula experimental gratuita.' },
      { name: 'keywords', content: 'dança curitiba, escola de dança curitiba, ruah, dança católica curitiba, jazz contemporâneo curitiba, danças urbanas curitiba, aula experimental dança curitiba' },
      { name: 'author', content: 'Ruah System' },
      { property: 'og:title', content: 'Ruah | Dança e Profecia - Curitiba' },
      { property: 'og:description', content: 'Agende sua aula experimental gratuita. Transformando vidas através da dança e profecia.' },
      { property: 'og:image', content: './assets/ruah.PNG' },
      { property: 'og:type', content: 'website' }
    ]);

    this.loadPackages();
    this.loadLocais();
  }

  loadPackages(): void {
    this.packagesService.getAll().subscribe({
      next: (data) => {
        this.packages = data;
        this.loadingPackages = false;
        
        setTimeout(() => {
          this.observeElements('.package-card.reveal-card');
        }, 50);
      },
      error: () => {
        this.loadingPackages = false;
      },
    });
  }

  loadLocais(): void {
    this.locaisService.getLocais().subscribe({
      next: (data) => {
        this.locais = data;
        this.loadingLocais = false;
        
        setTimeout(() => {
          this.observeElements('.location-card.reveal-card');
        }, 50);
      },
      error: () => {
        this.loadingLocais = false;
      },
    });
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  ngAfterViewInit(): void {
    const video = document.querySelector('.hero-video') as HTMLVideoElement;

    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    }

    const selectors = [
      '.reveal-fade-up',
      '.reveal-scale',
      '.reveal-image',
      '.reveal-card',
      '.reveal-parallax'
    ];

    selectors.forEach(selector => {
      this.observeElements(selector);
    });
  }

  private observeElements(selector: string): void {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  scrollToPacotes(): void {
    const el = document.getElementById('pacotes');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  // === CONVERSÃO SECUNDÁRIA: Aula Experimental ===
  submitTrialClass(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const unidade = formData.get('unidade') as string;

    // Monta link do WhatsApp com mensagem personalizada
    const message = `Olá! Meu nome é ${name} e gostaria de agendar uma aula experimental gratuita na unidade ${unidade}. Meu WhatsApp: ${whatsapp}`;
    this.trialWhatsAppLink = `https://wa.me/5541987917610?text=${encodeURIComponent(message)}`;

    // Dispara evento para o GTM
    this.pushToDataLayer({
      event: 'book_trial_class',
      lead_name: name,
      lead_whatsapp: whatsapp,
      lead_unit: unidade
    });

    this.trialSent = true;
  }

  // === RASTREAMENTO ===
  trackCta(ctaName: string): void {
    this.pushToDataLayer({
      event: 'cta_click',
      cta_name: ctaName
    });
  }

  trackWhatsApp(location: string): void {
    this.pushToDataLayer({
      event: 'contact_whatsapp',
      button_location: location
    });
  }

  private pushToDataLayer(data: Record<string, string>): void {
    const w = window as any;
    if (w.dataLayer) {
      w.dataLayer.push(data);
    }
  }
}
