# Architecture Standards

## 1. Polyrepo Autonomy & Boundary Isolation
- Every client project is an autonomous repository in F:\Clients\<ClientName>.
- Cross-project dependencies must strictly go through documented network APIs or standardized webhook schemas, never direct filesystem access.

## 2. Layered Component Design
- **Presentation Layer:** Lightweight HTML5/CSS3/JS, Next.js, or Thymeleaf.
- **Application / Service Layer:** Stateless controllers, business orchestrators, and AI agents.
- **Persistence Layer:** PostgreSQL schemas with strict foreign key constraints and transactional integrity.
- **Infrastructure Layer:** Docker containers, Traefik edge routing, automated SSL.
