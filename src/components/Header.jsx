import { motion } from 'framer-motion';

const Header = () => {
  return (
    <div className="relative w-full overflow-x-hidden"> {/* Prevent horizontal scroll during animation */}
      
     
      <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 2 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >

          <img 
            src="https://plus.unsplash.com/premium_photo-1675865394768-564a9179f411?q=80&w=1025&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="India Landscape"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 text-center text-6xl md:text-9xl font-extrabold tracking-tighter"
        >
          <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">
            WELCOME <br /> TO <br /> INDIA
          </span>
        </motion.h1>
      </div>
      <div className="min-h-[100vh] flex flex-col md:flex-row items-center justify-between bg-slate-100 p-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="
            w-full max-w-2xl
            bg-white/30 backdrop-blur-md 
            border border-white/40 
            shadow-2xl rounded-3xl p-12
            flex flex-col  gap-6 text-center
          "
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900">
            WHY INCREDIBO?
          </h2>
          <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
          <p className="text-lg text-slate-800 font-medium leading-relaxed">
           Welcome to Incredibo,"made by Indians for India!!". This website will tell you all the minor and major monuments located in India.India has a vast range of tourist places.It will be the thresold of your journey across India.it also contain a map and entire database of all places located in India.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="
            w-full max-w-2xl
            bg-white/30 backdrop-blur-md 
            border border-white/40 
            shadow-2xl rounded-3xl p-12
            flex flex-col gap-6 text-center m-2
          "
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900">
           Yatri
          </h2>
          <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
          <p className="text-lg text-slate-800 font-medium leading-relaxed">
            Presenting you our new AI (Yatri),This will act as a virtual guide in your tour.It is avialable for 24/7.It has a feature where it will first ask you about camera permission, and then will detect the monument present infront the camera and then will give all the answer that you will ask about the place.<br/>We Hope you like this feature.<br/>Thankyou.                                
          </p>
        </motion.div>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Header;