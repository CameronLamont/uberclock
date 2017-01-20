/**
 * ClockController
 *
 * @description :: Server-side logic for managing clocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    doTick: function (clockid) {
     
        Clock.findOne({ id: clockid }).exec(
            function (err, clk) {
                if (err) return err;
                if (!clk) return "not found";
                var currentdate = new Date();
                var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth() + 1) + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
                
                var clockupdate;
                //console.log(datetime);
                console.log(clk);
                if (clk.enabled && clk.timevalue > 0) {
                    clockupdate = { timevalue: clk.timevalue - 1,status: "Ticking" };
                     
                }
                else if (clk.timevalue == 0) {
                    
                    clockupdate = { status: "Time's Up" };
                    

                }
                else {

                    clockupdate = { status:  "Time paused" };
                    
                }



                Clock.update({ id: clockid }, clockupdate).exec(
                        function (err, updated) {
                            if (err) return err;

                            console.log(datetime, updated.id, updated.timevalue, updated.status);
                            console.log(updated);
                            sails.sockets.broadcast('clock' + clockid,"tick",updated);
                            return clk; //updated;    
                    });
            });
    },


    enable: function (req, res) {
        
        
        Clock.update({ id: req.param("clockid"), enabled: false },
            { enabled: true}).exec(
            function (err, updated) {
                if (err) return res.negotiate(err);

                if (!updated) return res.json(req.param("clockid") + " not found");
                console.log("Enabled");
                console.log(updated);

                if (!module.exports.tickers) module.exports.tickers = [];                
                newticker = sails.timers.setInterval(module.exports.doTick, 1000, req.param("clockid"));
                module.exports.tickers['clock' + req.param("clockid")] = newticker;
                module.exports.doTick(req.param("clockid"));
                return res.json("clock " + req.param("clockid") + " enabled");
        });
        
          
      
    },
    disable: function (req, res) {
        Clock.update({ id: req.param("clockid"), enabled: true }, {enabled: false}).exec(
            function (err, updated) {
                if (err) return res.negotiate(err);
               
                if (!updated) return res.json(req.param("clockid") + " not found");
               //module.exports.tick(req, res);
                console.log("Disabled");
                console.log(updated);
                                     
                if (module.exports.tickers) {
                    sails.timers.clearInterval(module.exports.tickers['clock' + req.param("clockid")]);
                    
                    module.exports.tickers['clock' + req.param("clockid")] = null;
                }
                module.exports.doTick(req.param("clockid"));
                return res.json("clock " + req.param("clockid") + " disabled");
        
            });
        

        
    },
    tick: function (req, res) {

        if (req.isSocket) {
            sails.sockets.join(req, 'clock' + req.param("clockid"), function (err) {
                if (err) res.negotiate(err);
                console.log('clock' + req.param("clockid"), "new subscriber " + req.socket.id);
            });   
        }
         Clock.findOne({ id: req.param("clockid") }).exec(
        function (err, clk) {
            if (err) return res.negotiate(err);

            return res.json(clk);
            });
        
    
   }
    
};

