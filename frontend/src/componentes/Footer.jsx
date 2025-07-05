export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 hidden md:block">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sobre */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre o Cinopse</h3>
                        <ul className="space-y-2">

                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">Equipe</a></li>
                        </ul>
                    </div>

                    {/* Suporte */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Suporte</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">Contato</a></li>
                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">Política de Privacidade</a></li>
                        </ul>
                    </div>

                    {/* Redes Sociais */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Siga-nos</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-black font-bold hover:text-red-600 transition-colors">Instagram</a></li>
                            
                            
                        </ul>
                    </div>
                </div>

                <div className="border-gray-300 text-center">
                    <p className="text-gray-600">© 2024 Cinopse. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
