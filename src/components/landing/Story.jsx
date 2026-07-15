export default function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap">
        <div>
          <div className="eyebrow" style={{ color: '#D9A441' }}>Rooted in local food</div>
          <h2>Healthy eating isn't an imported luxury. It's on your plate already.</h2>
          <p>Most nutrition apps are built around bagels, bacon and pretzels. Lishe Bora is built on the FAO and Ministry of Health's Kenya Food Composition Tables, so tracking a plate of ugali, sukuma wiki and omena is exactly as easy as logging a Western meal  because it should be.</p>
          <div className="staple-tags">
            <span>Sukuma Wiki</span><span>Ugali</span><span>Managu</span><span>Terere</span><span>Arrowroots</span><span>Githeri</span><span>Omena</span><span>Nyama Choma</span>
          </div>
        </div>
        <div className="story-art">
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
            <circle cx="160" cy="160" r="150" stroke="#D9A441" strokeOpacity="0.35" strokeWidth="1.5" />
            <path d="M160 60 L172 140 L250 152 L172 164 L160 244 L148 164 L70 152 L148 140 Z" fill="#2B5F4E" opacity="0.9" />
            <path d="M90 90 q30 10 20 45 q-35 5 -40 -25 q5 -15 20 -20z" fill="#D9A441" />
            <path d="M230 90 q-30 10 -20 45 q35 5 40 -25 q-5 -15 -20 -20z" fill="#C1502E" />
            <circle cx="160" cy="160" r="6" fill="#F6EFE0" />
          </svg>
        </div>
      </div>
    </section>
  );
}
