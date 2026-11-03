const TESTIMONIALS = [
  { name: "Ayesha R.", city: "Dhaka", quote: "The co-ord set felt premium and the Cash on Delivery was easy." },
  { name: "Nusrat K.", city: "Chattogram", quote: "Loved the three-piece colour and fit." },
  { name: "Mahiya S.", city: "Sylhet", quote: "Quick delivery outside Dhaka and lovely finishing." },
];

export default function HomeTestimonials() {
  return (
    <section className="home-section wrap">
      <div className="section-title">
        <p className="eyebrow">LOVED BY CUSTOMERS</p>
        <h2>What women are saying</h2>
      </div>
      <div className="testimonial-grid">
        {TESTIMONIALS.map((item) => (
          <blockquote key={item.name} className="testimonial">
            <p>“{item.quote}”</p>
            <cite>{item.name}, {item.city}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
