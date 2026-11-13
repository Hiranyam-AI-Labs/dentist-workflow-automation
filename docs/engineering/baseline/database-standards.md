# Database Standards

## 1. PostgreSQL Schema Isolation
- Standard engine: PostgreSQL 15+.
- Every client has a dedicated database schema (dg_online, hemkar_realty, mooltatva, rogyam).
- Never run production queries in the default public schema without qualification.

## 2. Migrations & Backups
- Schema changes must be versioned SQL scripts (Flyway or Drizzle Kit).
- Automated daily pg_dump backups with 30-day retention on Hostinger VPS.
- No raw passwords in database connection strings.
