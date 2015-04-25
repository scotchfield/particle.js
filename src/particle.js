var particle = (function () {

    'use strict';

    var particle = {}, canvas = false, ctx = false, timer,
        particle_array = [], generator_array = [],

    // A collection of options can be passed to create.
    options = {
        width: 300,
        height: 300,
        backgroundColor: '#000000',
        imageSmoothingEnabled: true,
        interval: 25,
        gravity: 0.5,
    };

    particle.addParticle = function (p) {
        p.x = p.x || 0;
        p.y = p.y || 0;
        p.vx = p.vx || 0;
        p.vy = p.vy || 0;
        p.style = p.style || '#ffffff';

        particle_array.push(p);
    };

    particle.addGenerator = function (g) {
        g.x = g.x || 0;
        g.y = g.y || 0;
        g.vx = g.vx || 10;
        g.vy = g.vy || 10;
        g.style = g.style || function () { return '#ffffff'; };

        generator_array.push(g);
    };

    particle.update = function () {
        var i, p;

        generator_array.forEach(function (g) {
            particle.addParticle({x: g.x, y: g.y,
                        vx: Math.random() * (g.vx + g.vx) - g.vx,
                        vy: Math.random() * (g.vx + g.vx) - g.vx,
                        style: g.style(),
            });
        });

        for (i = particle_array.length - 1; i >= 0; i -= 1) {
            p = particle_array[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += options.gravity;

            if (p.x < 0) {
                p.x = 0;
                p.vx *= -1;
            } else if (p.x > options.width) {
                p.x = options.width;
                p.vx *= -1;
            }
            if (p.y < 0) {
                p.y = 1;
                p.vy *= -1;
            }

            if (p.y >= options.height) {
                particle_array.splice(i, 1);
            }
        };
    };

    particle.draw = function () {
        particle.clear()
            .update();

        particle_array.forEach(function (p) {
            particle.style(p.style);
            ctx.fillRect(p.x, p.y, 3, 3);
        });
    };

    // Clear the canvas using the style specified in options.
    particle.clear = function () {
        particle.style(options.backgroundColor);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return this;
    };

    // Set the active style when drawing to the canvas. This might be a
    // hex colour code, rgb/rgba value, or other style information.
    particle.style = function (c) {
        ctx.fillStyle = c;

        return this;
    };

    particle.canvas = function (opt) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k)) {
                options[k] = opt[k];
            }
        }

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        canvas.width = options.width;
        canvas.height = options.height;
        this.clear();

        ctx.imageSmoothingEnabled = options.imageSmoothingEnabled;

        timer = setInterval(function () {
            particle.draw();
        }, options.interval);

        return canvas;
    };

    // Creates a new canvas object and appends it to the DOM element specified
    // by the id argument.
    particle.create = function (id, options) {
        canvas = this.canvas(options);
        document.getElementById(id).appendChild(canvas);

        return this;
    };

    return particle;

}());
