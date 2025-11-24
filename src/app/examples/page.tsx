"use client";

import { useState } from "react";
import { Button, Card, Input, Loader, Modal } from "@/components";

export default function ExamplesPage() {
    const [inputValue , setInputValue] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div style={{ padding: 20 }}>
            <h1>Component Examples  </h1>
            <Card title="Sample Card">
                <p>This is an example of a Card component.</p>
            </Card>

            <Input label="sample input" value={inputValue} onChange={setInputValue}/>
            
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Loader />

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>This is an example of a Modal component.</p>
                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </Modal>
        </div>
    );
}