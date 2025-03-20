import { SearchIcon } from "lucide-react";
import { Input } from '../ui/input';
import AnimationContainer from './animation-container';

interface Props {
    searchQuery: string;
    handleSearch: (query: string) => void;
}

const Searchbar = ({ searchQuery, handleSearch }: Props) => {
    return (
        <AnimationContainer className="w-full flex items-center justify-center">

            <div className="relative w-full">

                <SearchIcon className="absolute left-3 top-3.5 transform w-5 h-5 text-muted-foreground" />

                <Input
                    type="text"
                    placeholder="Search for a blog post"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full h-12 pl-10 rounded-lg"
                />

            </div>

        </AnimationContainer>
    )
};

export default Searchbar
