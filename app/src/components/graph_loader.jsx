import React, { useEffect } from 'react';

/**
 * Componente de loader para gráficas (Skeleton Loader).
 * Simula la forma de diferentes tipos de gráficas mientras cargan.
 *
 * @param {object} props - Propiedades del componente.
 * @param {'bar' | 'pie' | 'line' | 'table'} [props.type='bar'] - Tipo de gráfica para simular.
 * @param {string} [props.height='200px'] - Altura del contenedor del loader.
 * @param {string} [props.width='100%'] - Ancho del contenedor del loader.
 */
const GraphLoader = ({ type = 'bar', height = '200px', width = '100%' }) => {

    // Inyectar los keyframes CSS para las animaciones del skeleton loader
// Esta es la misma técnica que usamos para el spinner principal,
// ya que los keyframes no se pueden poner en línea.
useEffect(() => {
    const styleId = 'graph-loader-animation-style';
    if (!document.getElementById(styleId)) {
        const styleSheet = document.createElement("style");
        styleSheet.setAttribute("id", styleId);
        styleSheet.innerHTML = `
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .shimmer-animation {
                background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite linear;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    // No necesitamos una función de limpieza para este caso
}, []);

    const containerStyle = {
        width: width,
        height: height,
        // backgroundColor: '#f9f9f9', // Fondo claro para el loader
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end', // Alinea los elementos de la barra hacia abajo
        alignItems: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        position: 'relative', // Para posicionar elementos internos
        // border: '1px solid #eee' // Borde sutil
    };

    const shimmerBaseStyle = {
        borderRadius: '4px',
        backgroundColor: 'rgb(210, 172, 185)', // Color base del skeleton
        position: 'absolute', // Asegura que las formas se superpongan
        opacity: 0.7 // Un poco de transparencia
    };

    const titlePlaceholderStyle = {
        ...shimmerBaseStyle,
        top: '15px',
        left: '15px',
        width: '60%',
        height: '20px',
        borderRadius: '4px',
        backgroundColor: '#e0e0e0', // Un tono más oscuro para el título
        zIndex: 1 // Asegura que el título esté encima
    };

    const renderBarGraphLoader = () => (
        <div style={{ ...containerStyle, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '20px' }}>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '15%', height: '70%', marginBottom: '5px' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '15%', height: '50%', marginBottom: '5px' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '15%', height: '90%', marginBottom: '5px' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '15%', height: '60%', marginBottom: '5px' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '15%', height: '80%', marginBottom: '5px' }}></div>
            {/* Opcional: Eje Y */}
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'absolute', left: '5px', top: '10%', width: '3px', height: '80%' }}></div>
            {/* Opcional: Eje X */}
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'absolute', bottom: '15px', left: '10%', width: '80%', height: '3px' }}></div>
            {/* <div style={titlePlaceholderStyle} className="shimmer-animation"></div> Título de la gráfica */}
        </div>
    );

    const renderPieGraphLoader = () => (
        <div style={{ ...containerStyle, justifyContent: 'center', alignItems: 'center' }}>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', borderRadius: '50%', width: '80%', height: '80%' }}></div>
            {/* <div style={titlePlaceholderStyle} className="shimmer-animation"></div> Título de la gráfica */}
        </div>
    );

    const renderLineGraphLoader = () => (
        <div style={{ ...containerStyle, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {/* Línea simulada */}
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '90%', height: '5px', transform: 'rotate(-5deg)', top: '10px' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'relative', width: '90%', height: '5px', transform: 'rotate(10deg)', bottom: '20px' }}></div>
            {/* Ejes */}
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'absolute', left: '15px', top: '15%', width: '3px', height: '70%' }}></div>
            <div className="shimmer-animation" style={{ ...shimmerBaseStyle, position: 'absolute', bottom: '15px', left: '10%', width: '70%', height: '3px' }}></div>
            <div style={titlePlaceholderStyle} className="shimmer-animation"></div> {/* Título de la gráfica */}
        </div>
    );

    const renderTableLoader = () => (
        <div style={{ ...containerStyle, padding: '15px', justifyContent: 'flex-start' }}>
            <div style={{ ...titlePlaceholderStyle, top: '15px', left: '15px', width: '70%' }} className="shimmer-animation"></div> {/* Título de la tabla */}
            {/* Encabezados de tabla */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginBottom: '10px', marginTop: '40px' }}>
                <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '15px' }}></div>
                <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '15px' }}></div>
                <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '15px' }}></div>
            </div>
            {/* Filas de tabla */}
            {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginBottom: '8px' }}>
                    <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '12px' }}></div>
                    <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '12px' }}></div>
                    <div className="shimmer-animation" style={{ ...shimmerBaseStyle, width: '20%', height: '12px' }}></div>
                </div>
            ))}
        </div>
    );

    switch (type) {
        case 'pie':
            return renderPieGraphLoader();
        case 'line':
            return renderLineGraphLoader();
        case 'table':
            return renderTableLoader();
        case 'bar':
        default:
            return renderBarGraphLoader();
    }
};

export default GraphLoader;