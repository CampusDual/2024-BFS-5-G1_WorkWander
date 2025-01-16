import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { OTranslateService } from "ontimize-web-ngx";
@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent {
  featuredSpaces = [
    {
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
      title: "CO|WORKING",
      location: "Lucillos",
      price: "18,00",
      rating: 4,
      amenities: ["wifi", "coffee", "monitor"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80",
      title: "Coworking Marcelino",
      location: "Vigo",
      price: "9,99",
      rating: 3.3,
      amenities: ["wifi", "coffee", "monitor"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80",
      title: "CoTecMe",
      location: "Outeiro de Rei",
      price: "20,00",
      rating: 4.3,
      amenities: ["wifi", "monitor"],
    },
  ];

  features = [
    {
      icon: "🏢", // Edificio para espacios de calidad
      title: this.translate.get("L_FEATURES_TITLE_1"),
      description:
        this.translate.get("L_FEATURES_CONTENT_1"),
    },
    {
      icon: "🤝", // Apretón de manos para networking
      title: this.translate.get("L_FEATURES_TITLE_2"),
      description:
      this.translate.get("L_FEATURES_CONTENT_2"),
    },
    {
      icon: "📈", // Gráfico ascendente para métricas
      title: this.translate.get("L_FEATURES_TITLE_3"),
      description:
      this.translate.get("L_FEATURES_CONTENT_3"),
    },
  ];
  testimonials = [
    {
      name: "Ana I. Ibáñez Manzano",
      rating: 5,
      feedback: "Muchos espacios de calidad en Madrid. Todo perfecto.",
    },
    {
      name: "Borja R.",
      rating: 4,
      feedback: "Totalmente recomendable, siempre limpio y con buena atención.",
    },
    {
      name: "Gabriela Vidal",
      rating: 5,
      feedback: "Super profesionales, el mejor coworking que he probado.",
    },
  ];



  events = [
    {
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
      title: "Networking Coffee & Code",
      location: "Madrid Tech Hub",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80",
      title: "Workshop: Emprendimiento Digital",
      location: "Barcelona Innovation Center",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      title: "Startup Weekend",
      location: "Valencia Coworking Space",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80",
      title: "Tech Meetup",
      location: "Sevilla Digital Hub",
      date: "25/02/2025",
    },
  ];

  responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private router: Router,
    private translate: OTranslateService
  ) {}

  entradaSinLogin() {
    this.router.navigate([" "]);
  }
  registerUser() {
    this.router.navigate(["register/user/new"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
