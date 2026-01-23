"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { db } from "@/lib/db"

interface ClientSelectorProps {
    value: string
    onSelect: (client: { name: string, address: string, email: string, phone: string }) => void
}

export function ClientSelector({ value, onSelect }: ClientSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [clients, setClients] = React.useState<any[]>([])
    const [searchValue, setSearchValue] = React.useState("")

    React.useEffect(() => {
        // Load clients on mount
        const load = async () => {
            const res = await db.getAllClients()
            setClients(res)
        }
        load()
    }, [open]) // Reload when opening to get fresh list

    const handleCreateNew = () => {
        // Create a dummy client object for the new name
        const newClient = {
            name: searchValue,
            address: "",
            email: "",
            phone: ""
        };
        onSelect(newClient);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? clients.find((client) => client.name === value)?.name || value
                        : "Select or type new client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search client..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        <CommandEmpty className="py-2 px-2 text-sm">
                            <p className="mb-2">No client found.</p>
                            {searchValue && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full h-8"
                                    onClick={handleCreateNew}
                                >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Use "{searchValue}"
                                </Button>
                            )}
                        </CommandEmpty>
                        <CommandGroup heading="Registered Clients">
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.name}
                                    onSelect={() => {
                                        onSelect(client)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === client.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {client.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
