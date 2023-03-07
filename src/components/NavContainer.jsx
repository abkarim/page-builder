import PropTypes from 'prop-types'

export default function NavContainer({ text, icon, ...props }) {
    return (
        <section
            className="bg-[#e5e5e5] rounded-sm p-2 text-center cursor-pointer"
            {...props}
        >
            <figure>
                <span className="font-bold text-3xl inline-block my-4">
                    {icon}
                </span>
            </figure>
            <footer className="font-sans">{text}</footer>
        </section>
    )
}

NavContainer.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.string,
}
