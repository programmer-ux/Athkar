import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 container mx-auto max-w-2xl p-4 min-h-screen">
      <header className="text-center py-6">
         <Skeleton className="w-12 h-12 mx-auto rounded-full mb-2" />
         <Skeleton className="h-8 w-3/4 mx-auto mb-1" />
         <Skeleton className="h-4 w-1/2 mx-auto" />
       </header>

       <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
           <Skeleton className="h-7 w-1/3" />
           <Skeleton className="h-8 w-8 rounded-full" />
         </div>
         <Skeleton className="h-2 w-full mb-1" />
         <Skeleton className="h-3 w-1/4 mx-auto mb-4" />
         <div className="space-y-4">
           <Skeleton className="h-20 w-full rounded-lg" />
           <Skeleton className="h-20 w-full rounded-lg" />
           <Skeleton className="h-20 w-full rounded-lg" />
         </div>
       </div>

       <Skeleton className="h-px w-full my-6" />

       <div className="mb-8">
         <div className="flex justify-between items-center mb-4">
           <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
         </div>
         <Skeleton className="h-2 w-full mb-1" />
         <Skeleton className="h-3 w-1/4 mx-auto mb-4" />
         <div className="space-y-4">
           <Skeleton className="h-20 w-full rounded-lg" />
           <Skeleton className="h-20 w-full rounded-lg" />
         </div>
       </div>

       <footer className="text-center py-4 mt-8">
          <Skeleton className="h-3 w-3/4 mx-auto mb-1" />
          <Skeleton className="h-3 w-1/4 mx-auto" />
       </footer>
    </div>
  );
}
