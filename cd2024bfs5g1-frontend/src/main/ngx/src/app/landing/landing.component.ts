import { Component } from "@angular/core";
import { Router } from "@angular/router";

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
      title: "Espacios de Calidad",
      description:
        "Accede a espacios de trabajo profesionales y completamente equipados",
    },
    {
      icon: "🤝", // Apretón de manos para networking
      title: "Eventos y Networking",
      description:
        "Participa en eventos exclusivos y conecta con otros profesionales",
    },
    {
      icon: "📈", // Gráfico ascendente para métricas
      title: "Métricas y Análisis",
      description:
        "Gestiona y optimiza el rendimiento de tus espacios con datos detallados",
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
    { title: "Evento número 1", location: "Madrid", date: "25/02/2025" },
    { title: "Evento número 2", location: "Barcelona", date: "25/02/2025" },
    { title: "Evento número 3", location: "Valencia", date: "25/02/2025" },
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

  constructor(private router: Router) {}

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
