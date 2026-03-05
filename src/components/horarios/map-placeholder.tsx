export function MapPlaceholder() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.8940978091705!2d-54.634381!3d-20.469542399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e7d2452436e1%3A0x76820d3c3e9a820d!2sDojo%20Luciano%20dos%20Santos%20Karat%C3%AA%20Shotokan!5e0!3m2!1spt-BR!2sbr!4v1772644948569!5m2!1spt-BR!2sbr"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-xl shadow-lg"
      title="Dojo Luciano dos Santos Karatê Shotokan"
      aria-label="Mapa da localização do dojo"
    />
  );
}
