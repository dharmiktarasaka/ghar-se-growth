from PIL import Image

img = Image.open('Ghar Se Growth Workshop Landing Page (1).png')

# 1. Logo mark
logo = img.crop((48, 12, 114, 53))
logo.save('assets/images/ref_logo.png')

# 2. Hero Woman & desk (remove navbar sliver)
hero_woman = img.crop((345, 48, 749, 425))
hero_woman.save('assets/images/ref_hero_woman.png')

# 3. 4 Personas
# Let's inspect the cards:
p1 = img.crop((44, 614, 196, 678))
p1.save('assets/images/ref_persona_homemaker.png')

p2 = img.crop((212, 614, 364, 678))
p2.save('assets/images/ref_persona_mother.png')

p3 = img.crop((380, 614, 532, 678))
p3.save('assets/images/ref_persona_worker.png')

p4 = img.crop((548, 614, 700, 678))
p4.save('assets/images/ref_persona_professional.png')

# 4. Handwritten badge 1 (Different Stories. Same Dream...)
badge1 = img.crop((525, 485, 690, 580))
badge1.save('assets/images/ref_badge_different_stories.png')

# 5. Woman with laptop in Paths section
laptop_woman = img.crop((555, 1395, 745, 1530))
laptop_woman.save('assets/images/ref_laptop_woman.png')

# 6. Handwritten badge 2 (Different Skills. Real Opportunities...)
badge2 = img.crop((390, 1380, 555, 1435))
badge2.save('assets/images/ref_badge_real_opportunities.png')

# 7. Ranu Patel collage (complete with polaroids and badge)
ranu_collage = img.crop((12, 1555, 255, 1755))
ranu_collage.save('assets/images/ref_ranu_collage.png')

# 8. Left and Right vines for green section
left_vine = img.crop((0, 815, 65, 965))
left_vine.save('assets/images/ref_vine_left.png')

right_vine = img.crop((684, 815, 749, 965))
right_vine.save('assets/images/ref_vine_right.png')

print("All exact assets extracted!")
