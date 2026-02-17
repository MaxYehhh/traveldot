import { Pencil, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export interface TripContextMenuProps {
    tripId: string
    children: React.ReactNode
    onEdit: () => void
    onDelete: () => void
}

export const TripContextMenu = ({ children, onEdit, onDelete }: TripContextMenuProps) => {
    return (
        <DropdownMenu>
            {/* The trigger wraps the card; right-click behaviour is handled by the
                DropdownMenu trigger in context-menu style via onContextMenu. */}
            <DropdownMenuTrigger asChild>
                <div
                    onContextMenu={(e) => {
                        // Prevent browser native context menu and open our custom menu
                        e.preventDefault()
                        // Programmatic open is handled by Radix when the trigger is clicked;
                        // for right-click we need to forward the click to the trigger.
                        ;(e.currentTarget as HTMLElement).click()
                    }}
                    className="cursor-context-menu"
                >
                    {children}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }}
                    className="gap-2"
                >
                    <Pencil className="h-4 w-4" />
                    編輯
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                    刪除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
