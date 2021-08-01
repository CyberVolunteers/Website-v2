import { Button } from "@material-ui/core";
import Link from "next/link";
import React from "react";

export default function Listing() {
    return <div>
        <h1>This is a listing title</h1>

        <p>
            <p>Desc: {"bla bla bla"}</p>
        </p>

        {/* Etc */}

        <Button>
            <p>
                want to help
            </p>
        </Button>
    </div>
}
