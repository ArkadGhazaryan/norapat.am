const features = [
  "Public shop",
  "Customer accounts",
  "Checkout",
  "Admin panel",
  "Analytics",
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Norapat.am</p>
        <h1>Foodcourt shop starter</h1>
        <p className="intro">
          Next.js is installed and ready for building the Norapat e-commerce
          experience: catalog, product pages, checkout, profiles, and
          management tools.
        </p>
      </section>

      <section className="panel" aria-label="Planned modules">
        {features.map((feature) => (
          <div className="feature" key={feature}>
            {feature}
          </div>
        ))}
      </section>
    </main>
  );
}
