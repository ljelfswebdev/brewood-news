// components/Contact/Cards.jsx
import Link from 'next/link';

const PhoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5103 1.95422C11.8931 0.477547 10.2836 -0.303759 8.75227 0.110333L8.32256 0.227529C3.27541 1.60263 -1.03732 6.49361 0.220557 12.4472C3.11915 26.12 13.8776 36.8786 27.5502 39.7773C33.5114 41.043 38.3945 36.7224 39.7696 31.6751L39.8868 31.2454C40.3087 29.7062 39.5196 28.0967 38.0507 27.4873L30.4488 24.323C29.1596 23.7839 27.6674 24.159 26.7767 25.245L23.7609 28.9327C18.2684 26.206 13.8463 21.6431 11.3071 16.0412L14.7604 13.2285C15.8464 12.3456 16.2136 10.8533 15.6823 9.55633L12.5103 1.95422Z" fill="#4A56A6"/>
  </svg>
);

const AddressIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C21.3015 0 22.3529 1.05147 22.3529 2.35294V3.69853C29.5662 4.72794 35.2721 10.4338 36.3015 17.6471H37.6471C38.9485 17.6471 40 18.6985 40 20C40 21.3015 38.9485 22.3529 37.6471 22.3529H36.3015C35.2721 29.5662 29.5662 35.2721 22.3529 36.3015V37.6471C22.3529 38.9485 21.3015 40 20 40C18.6985 40 17.6471 38.9485 17.6471 37.6471V36.3015C10.4338 35.2721 4.72794 29.5662 3.69853 22.3529H2.35294C1.05147 22.3529 0 21.3015 0 20C0 18.6985 1.05147 17.6471 2.35294 17.6471H3.69853C4.72794 10.4338 10.4338 4.72794 17.6471 3.69853V2.35294C17.6471 1.05147 18.6985 0 20 0ZM8.23529 20C8.23529 26.5 13.5 31.7647 20 31.7647C26.5 31.7647 31.7647 26.5 31.7647 20C31.7647 13.5 26.5 8.23529 20 8.23529C13.5 8.23529 8.23529 13.5 8.23529 20ZM20 12.9412C23.8971 12.9412 27.0588 16.1029 27.0588 20C27.0588 23.8971 23.8971 27.0588 20 27.0588C16.1029 27.0588 12.9412 23.8971 12.9412 20C12.9412 16.1029 16.1029 12.9412 20 12.9412Z" fill="#4A56A6"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.75 0C1.67969 0 0 1.67969 0 3.75C0 4.92969 0.554687 6.03906 1.5 6.75L17.75 18.9375C19.0859 19.9375 20.9141 19.9375 22.25 18.9375L38.5 6.75C39.4453 6.03906 40 4.92969 40 3.75C40 1.67969 38.3203 0 36.25 0H3.75ZM0 10.3125V25C0 27.7578 2.24219 30 5 30H35C37.7578 30 40 27.7578 40 25V10.3125L24.5 21.9375C21.8359 23.9375 18.1641 23.9375 15.5 21.9375L0 10.3125Z" fill="#4A56A6"/>
  </svg>
);

function CardShell({ icon, title, children }) {
  return (
    <div className="rounded-primary border-2 border-primary p-8 flex items-center gap-8">
      <div className="shrink-0">{icon}</div>
      <div className="space-y-1">
        <div className="h6 break-all">{children}</div>
      </div>
    </div>
  );
}

export default function ContactCards({ phone, email, address }) {
  return (
    <div className="grid gap-6">
      {phone && (
        <CardShell icon={<PhoneIcon />} title="Phone">
          <a className="hover:underline" href={`tel:${String(phone).replace(/\s+/g, '')}`}>
            {phone}
          </a>
        </CardShell>
      )}

      {email && (
        <CardShell icon={<EmailIcon />} title="Email">
          <a className="hover:underline" href={`mailto:${email}`}>
            {email}
          </a>
        </CardShell>
      )}

      {address && (
        <CardShell icon={<AddressIcon />} title="Address">
          {/* If address is plain text, just pass it in. If it contains <br>, this handles it. */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: address }}
          />
        </CardShell>
      )}
    </div>
  );
}