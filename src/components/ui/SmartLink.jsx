import { Link } from 'react-router-dom';

const isExternalHref = (href) => /^(https?:|mailto:|tel:)/.test(href);

export default function SmartLink({ href, to, children, ...props }) {
    const destination = to ?? href ?? '#';

    if (destination.startsWith('#') || isExternalHref(destination)) {
        return (
            <a href={destination} {...props}>
                {children}
            </a>
        );
    }

    return (
        <Link to={destination} {...props}>
            {children}
        </Link>
    );
}
