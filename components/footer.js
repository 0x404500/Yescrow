import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer class="text-center m-5">
            <div>
                <p class="flex justify-center text-gray-500 text-xs">
                    <code class="text-gray-500 text-xs">
                        2023 © yescrow. All Rights Reserved. 
                        <span class="text-white"> escrow@yescrow.io</span>
                    </code>
                </p>
                <div class="flex justify-center m-3">
                    <Link
                        href="https://twitter.com/theyescrow"
                        rel="nofollow"
                        target="_blank"
                        >
                    <p>Twitter</p>
                    </Link>
                <Link 
                        href="https://github.com/sunsakis/Yescrow"
                        rel="nofollow"
                        target="_blank"
                        >
                            <Image src=
                            "/github.png"
                            class=" h-5 w-5 ml-2 bg-white rounded-full"
                            width="54"
                            height="54"
                            viewBox="0 0 54 54"
                            xmlns="http://www.w3.org/2000/svg"
                            alt="GitHub logo" />
                    </Link>
                    <Link
                        href="https://yescrow.io/blog"
                        rel="nofollow"
                        target="_blank"
                        >
                    <p class="ml-2"></p>
                    </Link>
                    </div>
            </div>
        </footer>

    )
}