const Count = () => {
  return (
    <section className="w-full rounded-lg border border-border px-3 py-4 backdrop-blur-[2px] md:p-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-16">
        <div className="text-center">
          <h3 className="font-cal text-3xl">50+</h3>
          <p className="font-light text-muted-foreground">Total tickets</p>
        </div>
        <div className="text-center">
          <h3 className="font-cal text-3xl">5+</h3>
          <p className="font-light text-muted-foreground">Categories</p>
        </div>
        <div className="text-center">
          <h3 className="font-cal text-3xl">100+</h3>
          <p className="font-light text-muted-foreground">Daily visitors</p>
        </div>
      </div>
    </section>
  );
};

export default Count;
