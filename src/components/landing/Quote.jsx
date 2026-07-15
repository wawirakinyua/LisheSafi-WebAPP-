export default function Quote() {
  return (
    <section className="quote-sec">
      <div className="wrap">
        <div>
          <svg className="quote-mark" viewBox="0 0 40 28" fill="none"><path d="M0 28V16C0 6 6 0 16 0v6c-6 0-10 4-10 10h10v12H0zm22 0V16c0-10 6-16 16-16v6c-6 0-10 4-10 10h10v12H22z" fill="#F6EFE0" /></svg>
          <blockquote>"Chakula ni uzima" Food is life. A plan that respects what you actually eat is the only plan you'll actually keep.</blockquote>
          <cite>A Kenyan proverb, and the founding idea behind Lishe Bora</cite>
        </div>
        <div className="bowl-art">
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
            <circle cx="130" cy="130" r="118" fill="#F6EFE0" />
            <circle cx="130" cy="130" r="118" stroke="#93391D" strokeWidth="6" />
            <circle cx="130" cy="130" r="96" stroke="#93391D" strokeWidth="2" strokeDasharray="4 6" />
            <circle cx="130" cy="130" r="70" fill="#E27B54" />
            <circle cx="130" cy="130" r="70" fill="url(#foodpattern)" />
            <circle cx="105" cy="112" r="9" fill="#2B5F4E" />
            <circle cx="150" cy="100" r="7" fill="#1F4A3D" />
            <circle cx="140" cy="150" r="11" fill="#D9A441" />
            <circle cx="112" cy="150" r="8" fill="#93391D" />
            <circle cx="160" cy="130" r="6" fill="#2B5F4E" />
            <defs>
              <radialGradient id="foodpattern" cx="0.3" cy="0.3" r="0.9">
                <stop offset="0" stopColor="#EE8A5D" />
                <stop offset="1" stopColor="#C1502E" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
