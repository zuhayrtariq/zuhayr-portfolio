import HomeSection from "@/components/sections/home-section";
import GradientBackground from "@/components/utils/gradient-background";

const Home = () => {
    return (
        <GradientBackground>
            <main className="relative min-h-screen">
                <HomeSection />
            </main>
        </GradientBackground>
    )
};

export default Home;
